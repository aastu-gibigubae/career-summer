import applySchema from '../schema/apply.schema.js';
import { ZodError } from 'zod';
import prisma from '../config/db.js';
import cloudFlareHelper from '../services/cloudflare.helper.js';
import applyStatusSchema from '../schema/apply.status.schema.js';
import errorUtil from '../utils/error.util.js';
export const applyController = async (req, res, next) => {
    try {
        const data = applySchema.parse(req.body);
        const { fullName, email, tgUsername, agileMethodology, ITTeam, phoneNumber, skills, year, } = data;
        if (!req.file) {
            throw new Error('CV is required');
        }
        if (req.file.mimetype !== 'application/pdf') {
            throw new Error('Only PDF files are allowed');
        }
        if (req.file.size > 2 * 1024 * 1024) {
            throw new Error('PDF must be less than or equal to 2MB');
        }
        const link = await cloudFlareHelper(req.file);
        console.log(link);
        await prisma.applicant.create({
            data: {
                fullName,
                email,
                cv: link,
                tgUsername,
                phoneNumber,
                agileMethodology,
                ITTeam,
                year,
                skill: {
                    create: skills.map((skillName) => ({
                        skill: {
                            connect: {
                                name: skillName,
                            },
                        },
                    })),
                },
            },
        });
        res.status(201).json({
            success: true,
            message: 'Application Submitted Successfully',
        });
    }
    catch (err) {
        if (err instanceof ZodError) {
            const error = new Error(err.issues.map((e) => e.message).join(', '));
            error.status = 400;
            return next(error);
        }
        return next(err);
    }
};
export const getApplicationController = async (req, res, next) => {
    try {
        const { name, skill, status, page = '1' } = req.query;
        const pageSize = 10;
        const skip = (parseInt(page) - 1) * pageSize;
        const where = {};
        if (name) {
            where.fullName = { contains: name, mode: 'insensitive' };
        }
        if (status) {
            where.status = status;
        }
        if (skill) {
            where.skill = {
                some: {
                    skill: { name: { equals: skill, mode: 'insensitive' } },
                },
            };
        }
        const applicants = await prisma.applicant.findMany({
            where,
            skip,
            take: pageSize,
            include: {
                skill: {
                    include: { skill: true },
                },
            },
        });
        const total = await prisma.applicant.count({ where });
        const totalPages = Math.ceil(total / pageSize);
        res.status(200).json({
            success: true,
            data: applicants,
            pagination: {
                total,
                page: Number(page),
                pageSize,
                totalPages,
            },
        });
    }
    catch (err) {
        return next(err);
    }
};
export const getAnalyticsController = async (req, res, next) => {
    try {
        const total = await prisma.applicant.count();
        const approved = await prisma.applicant.count({
            where: {
                status: 'approved',
            },
        });
        const pending = await prisma.applicant.count({
            where: {
                status: 'pending',
            },
        });
        const rejected = await prisma.applicant.count({
            where: {
                status: 'rejected',
            },
        });
        return res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                approved,
                rejected,
            },
        });
    }
    catch (err) {
        return next(err);
    }
};
export const applicationStatusController = async (req, res, next) => {
    try {
        const data = applyStatusSchema.parse(req.body);
        const { id, status } = data;
        const user = await prisma.applicant.findUnique({ where: { id } });
        if (!user)
            throw errorUtil('Unauthorized', 401);
        await prisma.applicant.update({
            where: { id },
            data: { status },
        });
        return res.status(200).json({
            success: true,
            message: 'Status updated successfully',
        });
    }
    catch (err) {
        if (err instanceof ZodError) {
            const error = new Error(err.issues.map((e) => e.message).join(', '));
            error.status = 400;
            return next(err);
        }
    }
};
