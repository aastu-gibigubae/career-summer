import z from 'zod';
import { STATUS } from '../generated/prisma/enums.js';
const applyStatusSchema = z.object({
    id: z.string(),
    status: z.enum(STATUS),
});
export default applyStatusSchema;
