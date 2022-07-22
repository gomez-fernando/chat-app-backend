/* eslint-disable @typescript-eslint/no-unused-vars */
import { BcryptService } from './bcrypt.service';
import { hashSync, compareSync } from 'bcryptjs';

describe('BcryptService', () => {
    jest.mock('bcryptjs');
    const mockEncrypt = jest.fn();
    const mockCompare = jest.fn();
    (hashSync as jest.Mock) = mockEncrypt;
    (compareSync as jest.Mock) = mockCompare;

  it('should be defined', () => {
    expect(BcryptService).toBeDefined();
  });

  describe('When calling service.encrypt', () => {
    test('Then service.encrypt should be called', () => {
        BcryptService.prototype.encrypt('password');
      expect(mockEncrypt).toHaveBeenCalled();
    });
  });

  describe('When calling service.compare', () => {
    test('Then service.compare should be called', () => {
        BcryptService.prototype.compare('password', 'hash');
      expect(mockCompare).toHaveBeenCalled();
    });
  });
});
