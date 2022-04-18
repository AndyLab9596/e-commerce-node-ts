"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const connect_1 = __importDefault(require("./db/connect"));
const not_found_1 = __importDefault(require("./middleware/not-found"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const authenticate_1 = require("./middleware/authenticate");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware 
app.use(express_1.default.json());
app.use((0, morgan_1.default)('tiny'));
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use(express_1.default.static('./public'));
app.use((0, express_fileupload_1.default)());
app.get('/', (req, res) => {
    res.send('Hello world');
});
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', authenticate_1.authenticateUser, userRoutes_1.default);
app.use('/api/v1/products', productRoutes_1.default);
app.use('/api/v1/reviews', reviewRoutes_1.default);
app.use('/api/v1/orders', orderRoutes_1.default);
app.use(not_found_1.default);
app.use(error_handler_1.default);
const port = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.default)(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    }
    catch (err) {
        console.log(err);
    }
});
start();
