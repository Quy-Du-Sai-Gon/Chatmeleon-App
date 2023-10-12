import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err); // Log the error for debugging purposes.

    if (err.code) {
        switch (err.code) {
            case 'P2002':
                res.status(400).json({ error: `${err.meta.message}` });
                break;
            case 'P2014':
                res.status(400).json({ error: `${err.meta.message}` });
                break;
            case 'P2003':
                res.status(400).json({ error: `${err.meta.message}` });
                break;
            case 'P2023':
                res.status(400).json({ error: `${err.meta.message}` });
                break;
            default:
                res.status(500).json({ error: `Something went wrong: ${err.message}` });
                break;
        }
    } else if (err instanceof Error) {
        res.status(500).json({ error: `Network error: ${err.message}` });
    } else {
        // Handle any other unknown errors
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export default errorMiddleware;
