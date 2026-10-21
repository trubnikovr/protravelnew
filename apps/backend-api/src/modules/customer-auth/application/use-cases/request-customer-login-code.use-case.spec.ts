import type { CustomerLoginChallengeRepository } from '../customer-login-challenge.repository';
import { RequestCustomerLoginCodeUseCase } from './request-customer-login-code.use-case';

describe('RequestCustomerLoginCodeUseCase', () => {
  it('creates a challenge and delegates the temporary code to SMS port', async () => {
    const challenges = { save: jest.fn() };
    const sms = {
      sendLoginCode: jest.fn().mockResolvedValue({ developmentCode: '4322' }),
    };
    const useCase = new RequestCustomerLoginCodeUseCase(
      challenges as unknown as CustomerLoginChallengeRepository,
      sms,
    );

    const result = await useCase.execute('+79991234567');

    expect(result.verificationId).toEqual(expect.any(String));
    expect(challenges.save).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '+79991234567', code: '4322' }),
    );
    expect(sms.sendLoginCode).toHaveBeenCalledWith('+79991234567', '4322');
    expect(result).toEqual(
      expect.objectContaining({ expiresIn: 300, developmentCode: '4322' }),
    );
  });
});
