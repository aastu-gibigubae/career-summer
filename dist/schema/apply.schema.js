import { z } from 'zod';
const applySchema = z.object({
    fullName: z.string().min(2).toLowerCase(),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    phoneNumber: z
        .string()
        .regex(/^(?:\+2519\d{8}|\+2517\d{8}|09\d{8}|07\d{8})$/)
        .transform((val) => (val.startsWith('0') ? '+251' + val.slice(1) : val)),
    agileMethodology: z.coerce.boolean(),
    tgUsername: z.string().min(2),
    ITTeam: z.coerce.boolean(),
    skills: z.preprocess((val) => (typeof val === 'string' ? [val] : val), z.array(z.string())),
    year: z.preprocess((val) => (typeof val === 'string' ? parseInt(val) : val), z.int().min(1).max(5)),
});
export default applySchema;
