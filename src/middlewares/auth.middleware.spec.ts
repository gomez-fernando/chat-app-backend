import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { AuthMiddleware } from './auth.middleware';

const auth = new AuthService();
let req = { get: jest.fn().mockReturnValue('bearer 123345')};
const resp: Response = {} as Response;
const next: NextFunction = jest.fn();
const mockAuthService = {
    createToken: jest.fn(),
    validateToken: jest.fn().mockReturnValue('token'),
} as AuthService;

const authMiddleware = new AuthMiddleware(mockAuthService);

describe('AuthMiddleware', () => {
    it('should be defined', () => {
        expect(new AuthMiddleware(auth)).toBeDefined();
    });

    describe('When use function is called with correct token', () => {
        test('Then it should call next without error', () => {
            (mockAuthService.validateToken as jest.Mock).mockReturnValueOnce({});
            authMiddleware.use(req as unknown as Request, resp, next);
            expect(next).toHaveBeenCalledWith();
        })
    });
    
    describe('When use function is called with incorrect token', () => {
        test('Then it should throw an exception', () => {
            expect(() =>
                authMiddleware.use(req as unknown as Request, resp, next)
            ).toThrow();
        });
    });
    
    describe('When use function is called with expired token', () => {
        test('Then it should throw an exception', () => {
            (mockAuthService.validateToken as jest.Mock).mockImplementation(
                () => {
                    throw new Error();
                }
            );
            expect(() =>
                authMiddleware.use(req as unknown as Request, resp, next)
            ).toThrow();
        });
    });
    describe('When use function is called with no token', () => {
        test('Then it should throw an exception', () => {
            req = { get: jest.fn().mockReturnValue('') };
            expect(() =>
                authMiddleware.use(req as unknown as Request, resp, next)
            ).toThrow();
        });
    });
});

