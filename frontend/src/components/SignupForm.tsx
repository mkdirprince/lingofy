import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

const createUserchema = z.object({
  username: z.string().min(1, "Username is required"),
  secretKey: z.string().min(8, "secretKey is required"),
  userLang: z.string().min(1, "Preferred language is required"),
  roomId: z
    .string()
    .refine(
      (roomId) => roomId.length === 4 && parseInt(roomId),
      "roomId must be 4-digit numbers"
    ),
});

// const joinRoomSchema = createUserchema.omit({
//   userLang: true,
// });

type SingUpInputs = z.infer<typeof createUserchema>;

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SingUpInputs>({ resolver: zodResolver(createUserchema) });

  const onSubmit: SubmitHandler<SingUpInputs> = (data) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>
          <label htmlFor="username">
            Username{" "}
            <input type="text" id="username" {...register("username")} />
          </label>
        </p>
        {errors.username ? (
          <span style={{ color: "red" }}>{errors.username.message}</span>
        ) : null}
        <p>
          <label htmlFor="secretKey">
            secretKey{" "}
            <input type="text" id="secretKey" {...register("secretKey")} />
          </label>
        </p>
        {errors.secretKey ? (
          <span style={{ color: "red" }}>{errors.secretKey.message}</span>
        ) : null}
        <p>
          <label htmlFor="roomId">
            roomId <input type="text" id="roomId" {...register("roomId")} />
          </label>
        </p>
        {errors.roomId ? (
          <span style={{ color: "red" }}>{errors.roomId.message}</span>
        ) : null}
        <p>
          <label htmlFor="userLang">
            Preferred language{" "}
            <select id="userLang" {...register("userLang")}>
              <option value="english">English</option>
              <option value="french">French</option>
            </select>
          </label>
        </p>
        {errors.userLang ? (
          <span style={{ color: "red" }}>{errors.userLang.message}</span>
        ) : null}
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default SignUpForm;
