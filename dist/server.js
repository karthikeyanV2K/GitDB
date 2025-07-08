import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { registerApiRoutes } from './api/index.js';
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 7896;
app.use(cors());
app.use(bodyParser.json());
registerApiRoutes(app);
app.get('/', (req, res) => {
    res.send('GitDB Server is running. See /api/v1 for API.');
});
app.listen(PORT, () => {
    console.log(`🚀 GitDB Server running at http://localhost:${PORT}`);
    console.log('API root: /api/v1');
});
//# sourceMappingURL=server.js.map