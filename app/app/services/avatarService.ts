export const AvatarsList = [
  { id: "1", path: require("../../assets/images/avatars/Kid1.png") },
  { id: "2", path: require("../../assets/images/avatars/Kid2.png") },
  { id: "3", path: require("../../assets/images/avatars/Kid3.png") },
  { id: "4", path: require("../../assets/images/avatars/Kid4.png") },
  { id: "5", path: require("../../assets/images/avatars/Kid5.png") },
  { id: "6", path: require("../../assets/images/avatars/Kid1.png") },
  { id: "7", path: require("../../assets/images/avatars/Kid2.png") },
  { id: "8", path: require("../../assets/images/avatars/Kid3.png") },
  { id: "9", path: require("../../assets/images/avatars/Kid4.png") },
  { id: "10", path: require("../../assets/images/avatars/Kid5.png") },
];

export const getAvatarPathById = (id: string) => {
  const avatar =
    AvatarsList.find((avatar) => avatar.id === id) || AvatarsList[0];
  return avatar.path;
};
