import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { readFileSync, writeFileSync, unlinkSync, copyFileSync } from "fs";
import { existsSync, mkdirSync } from "fs";
import * as path from "path";
import { dirname } from 'path';
import { fileURLToPath } from "url";
import { promisify } from "util";
import axios from "axios";
import { exec } from "child_process";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = promisify(exec);
const configPath = path.resolve(__dirname, "config.json");
const config = JSON.parse(readFileSync(configPath, "utf-8"));
const { root_path, api_path, admin_panel_path, api_port_number } = config;

// Function to copy config.json to dist folder
function copyConfigToDist() {
  const distDir = path.resolve(__dirname, "dist");
  if (!existsSync(distDir)) {
    mkdirSync(distDir);
  }
  copyFileSync(configPath, path.join(distDir, "config.json"));
}

// Setup directories on the remote server
async function setupDirectories(remotePath: string, username: string, host: string, password: string): Promise<void> {
  const spinner = ora("Setting up directories...").start();
  try {
    spinner.text = "Deleting existing directories...";
    await execPromise(
      `sshpass -p "${password}" ssh ${username}@${host} "rm -rf ${remotePath}${api_path} ${remotePath}${admin_panel_path} && mkdir -p ${remotePath}${api_path} ${remotePath}${admin_panel_path}" `
    );
    spinner.succeed("Directories set up successfully");
  } catch (error) {
    spinner.fail("Failed to set up directories");
    throw new Error((error as Error).message);
  }
}

// Seed user roles in the database
async function seedUserRoles(): Promise<void> {
  const spinner = ora("Seeding User Roles...").start();
  try {
    const baseUrl = `http://${config.hosting_server.ip}:${api_port_number}/api`;
    const userRoles = config.seed_data.userRoles;

    for (const [index, role] of userRoles.entries()) {
      spinner.text = `Inserting role: ${role.name} (${index + 1}/${userRoles.length})`;

      try {
        await axios.post(`${baseUrl}/userRoles`, role);
        spinner.succeed(`Role "${role.name}" inserted successfully`);
      } catch (error: any) {
        spinner.fail(
          `Failed to insert role "${role.name}": ${error.response?.data?.message || error.message}`
        );
      }
    }
    spinner.succeed("All user roles processed");
  } catch (error) {
    spinner.fail("Failed to seed user roles");
    throw new Error("Error seeding user roles: " + (error as Error).message);
  }
}

// Create an admin user
async function createAdminUser(username: string, password: string): Promise<void> {
  try {
    const baseUrl = `http://${config.hosting_server.ip}:${api_port_number}/api`;
    await axios.post(`${baseUrl}/adminUsers`, { username, password });
  } catch (error) {
    throw new Error("Failed to create admin user: " + (error as Error).message);
  }
}

// Build projects
async function buildProjects(): Promise<void> {
  const spinner = ora("Building projects...").start();
  try {
    spinner.text = "Building admin-panel...";
    await execPromise("npm run build", { cwd: path.resolve(__dirname, "../admin-panel") });

    spinner.text = "Building api...";
    await execPromise("npm run build", { cwd: path.resolve(__dirname, "../api") });

    spinner.succeed("Projects built successfully");
  } catch (error) {
    spinner.fail("Failed to build projects");
    throw new Error((error as Error).message);
  }
}

// Copy files to the server
async function copyToServer(remotePath: string, username: string, host: string, password: string): Promise<void> {
  const spinner = ora("Copying files to server...").start();
  try {
    spinner.text = "Copying admin-panel dist folder...";
    await execPromise(
      `sshpass -p "${password}" scp -r ${path.resolve(__dirname, "../admin-panel/dist")} ${username}@${host}:${remotePath}${admin_panel_path}`
    );

    spinner.text = "Copying api dist folder...";
    await execPromise(
      `sshpass -p "${password}" scp -r ${path.resolve(__dirname, "../api/dist")} ${username}@${host}:${remotePath}${api_path}`
    );

    spinner.succeed("Files copied successfully");
  } catch (error) {
    spinner.fail("Failed to copy files to server");
    throw new Error((error as Error).message);
  }
}

// Setup startup scripts on the server
async function setupStartupScripts(remotePath: string, username: string, host: string, password: string): Promise<void> {
  const spinner = ora("Setting up server startup scripts...").start();
  try {
    const startupScript = `#!/bin/bash
pm2 start ${remotePath}${admin_panel_path}/server.js --name admin-panel --watch
pm2 start ${remotePath}${api_path}/server.js --name api --watch
pm2 save
`;

    const tempScriptPath = path.resolve(__dirname, "startup.sh");
    writeFileSync(tempScriptPath, startupScript);

    await execPromise(
      `sshpass -p "${password}" scp ${tempScriptPath} ${username}@${host}:/tmp/startup.sh`
    );

    await execPromise(
      `sshpass -p "${password}" ssh ${username}@${host} "sudo mv /tmp/startup.sh /etc/init.d/story-world && sudo chmod +x /etc/init.d/story-world && sudo update-rc.d story-world defaults"`
    );

    unlinkSync(tempScriptPath);
    spinner.succeed("Startup scripts configured successfully");
  } catch (error) {
    spinner.fail("Failed to configure startup scripts");
    throw new Error((error as Error).message);
  }
}

// Main function to orchestrate the deployment process
async function main(): Promise<void> {
  try {
    console.clear();
    console.log(chalk.bold.cyan("\n=== Story World Deployment ===\n"));

    // Copy the config.json file to the dist folder
    copyConfigToDist();

    const { remotePath, username, host, password } = await inquirer.prompt([
      { type: "input", name: "remotePath", message: "Enter the remote server path to deploy the projects:", validate: (input) => input.length > 0 || "Remote path is required" },
      { type: "input", name: "username", message: "Enter the SSH username:", validate: (input) => input.length > 0 || "Username is required" },
      { type: "input", name: "host", message: "Enter the remote server hostname or IP:", validate: (input) => input.length > 0 || "Host is required" },
      { type: "password", name: "password", message: "Enter the SSH password:", validate: (input) => input.length > 0 || "Password is required" },
    ]);

    await setupDirectories(remotePath, username, host, password);
    await buildProjects();
    await copyToServer(remotePath, username, host, password);
    await setupStartupScripts(remotePath, username, host, password);

    const { seedRoles } = await inquirer.prompt([
      { type: "confirm", name: "seedRoles", message: "Do you want to seed user roles?", default: true },
    ]);
    if (seedRoles) await seedUserRoles();

    const { createAdmin } = await inquirer.prompt([
      { type: "confirm", name: "createAdmin", message: "Want to create an Admin user?", default: false },
    ]);

    if (createAdmin) {
      const { username: adminUsername } = await inquirer.prompt([
        { type: "input", name: "username", message: "Enter admin username:", validate: (input) => input.length >= 3 || "Username must be at least 3 characters" },
      ]);

      const { password: adminPassword } = await inquirer.prompt([
        { type: "password", name: "password", message: "Enter admin password:", validate: (input) => input.length >= 6 || "Password must be at least 6 characters" },
      ]);

      const spinner = ora("Creating admin user...").start();
      await createAdminUser(adminUsername, adminPassword);
      spinner.succeed("Admin user created successfully");
    }

    console.log(chalk.green("\nDeployment completed successfully!"));
  } catch (error) {
    console.error(chalk.red("\nError:"), (error as Error).message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error(chalk.red("\nFatal error:"), error);
  process.exit(1);
});

// Execute the main function
main().catch(console.error);
