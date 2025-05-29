
const generateUniqueInviteCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    exists = await TripModel.exists({ inviteCode: code });
  }
  return code;
};