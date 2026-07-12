export default async function errorMiddleware(err, req, res, _next) {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
}
