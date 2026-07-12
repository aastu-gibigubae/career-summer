export default function errorUtil(name, code) {
    const error = new Error(name);
    error.status = code;
    return error;
}
