/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthService } from './auth.service';
import { sign, verify } from 'jsonwebtoken';

jest.mock('jsonwebtoken');
const mockCreateToken = jest.fn();
const mockValidateToken = jest.fn();
(sign as jest.Mock) = mockCreateToken;
(verify as jest.Mock) = mockValidateToken;

describe('AuthService', () => {
  it('should be defined', () => {
    expect(AuthService).toBeDefined();
  });

  describe('When calling service.createToken', () => {
    test('Then service.createToken should be called', () => {
      AuthService.prototype.createToken('token');
      expect(mockCreateToken).toHaveBeenCalled();
    });
  });

  describe('When calling service.createToken and an issue occurs', () => {
    test('Then should return an exception', () => {
        mockCreateToken.mockRejectedValueOnce({});
        expect(async () => {
            AuthService.prototype.createToken('token')
        }).rejects.toThrow();

        // expect(
        //     AuthService.prototype.createToken('token')
        // ).rejects.toThrow();
    });
  });

  describe('When calling service.validateToken', () => {
    test('Then service.validateToken should be called', () => {
      AuthService.prototype.validateToken('token');
      expect(mockValidateToken).toHaveBeenCalled();
    });
  });
});
