import app from "./app.js";
import { envConfig } from "./config/config.js";
app.listen(parseInt(envConfig.PORT), () => {
    console.log(`Server listening on http://localhost:${parseInt(envConfig.PORT)}`);
});
