const zod = require("zod");

const loginValidate = zod.object({
  username: zod.string().regex(/^[a-zA-Z0-9._%+-]+@iitbhilai\.ac\.in$/i),
  password: zod.string().min(8),
});

const registerValidate = zod.object({
  username: zod.string().regex(/^[a-zA-Z0-9._%+-]+@iitbhilai\.ac\.in$/i),
  password: zod.string().min(8),
  //user_id: zod.string().min(2),
  name: zod.string().min(5),
  role: zod.string().min(5),
});

module.exports = {
  loginValidate,
  registerValidate,
};
