import { HomeService } from './home.service';
import type { ToursService } from './tours.service';
import type { Tour } from '../domain/tour';

describe('HomeService', () => {
  const list = jest.fn();
  const service = new HomeService({ list } as unknown as ToursService);

  beforeEach(() => jest.clearAllMocks());

  it('builds all mobile home collections from published tours', async () => {
    const dubai = tour('dubai', '10000', 'Dubai', 'UAE');
    const cheapDubai = tour('cheap-dubai', '8000', 'Dubai', 'UAE');
    const antalya = tour('antalya', '9000', 'Antalya', 'Turkey');
    list
      .mockResolvedValueOnce({ items: [dubai], total: 1 })
      .mockResolvedValueOnce({ items: [cheapDubai, antalya], total: 2 })
      .mockResolvedValueOnce({
        items: [dubai, cheapDubai, antalya],
        total: 3,
      });

    const result = await service.get();

    expect(result.recommended).toEqual([dubai]);
    expect(result.hotTours).toEqual([cheapDubai, antalya]);
    expect(result.popularDestinations).toEqual([
      expect.objectContaining({ id: 'Dubai', tour: cheapDubai }),
      expect.objectContaining({ id: 'Antalya', tour: antalya }),
    ]);
    expect(list).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ isFeatured: true, sortBy: 'sortOrder' }),
    );
  });
});

function tour(
  id: string,
  amount: string,
  cityName: string,
  countryName: string,
): Tour {
  return {
    id: { toString: () => id },
    price: { amount },
    destinations: [
      {
        cityId: cityName,
        countryId: countryName,
        cityName,
        countryName,
      },
    ],
  } as unknown as Tour;
}
