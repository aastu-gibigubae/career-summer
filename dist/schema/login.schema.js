import z from 'zod';
const loginSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email('Invalid email')),
    password: z.string().min(8, "Weak Password"),
});
export default loginSchema;
