import type { ISeat } from '../types/bus.types.js';

/**
 * Generate seat layout for a bus
 * @param totalSeats - Total number of seats in the bus
 * @param busType - Type of bus (Normal, Semi-Sleeper, Sleeper)
 * @param pricePerSeat - Base price per seat
 * @returns Array of seat objects
 */
export const generateSeatLayout = (
  totalSeats: number,
  busType: 'Normal' | 'Semi-Sleeper' | 'Sleeper',
  pricePerSeat: number
): ISeat[] => {
  const seats: ISeat[] = [];
  const seatsPerRow = 4;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  const seatTypes: ('Normal' | 'Upper' | 'Lower')[] =
    busType === 'Normal' ? ['Normal'] : ['Upper', 'Lower'];

  let seatCount = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < seatsPerRow && seatCount < totalSeats; col++) {
      const seatType = busType === 'Normal' ? 'Normal' : (seatTypes[row % 2] as 'Upper' | 'Lower');
      const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;

      // Sleeper buses have upper/lower levels
      let price = pricePerSeat;
      if (busType === 'Sleeper') {
        price = seatType === 'Upper' ? pricePerSeat * 0.9 : pricePerSeat;
      }

      const sleeperLevel = busType === 'Sleeper' && seatType !== 'Normal' ? seatType : undefined;

      seats.push({
        seatNumber,
        row,
        column: col,
        seatType: seatType as 'Normal' | 'Upper' | 'Lower',
        sleeperLevel: sleeperLevel as 'Upper' | 'Lower' | undefined,
        isAvailable: true,
        price: Math.round(price),
      });

      seatCount++;
    }
  }

  return seats;
};

/**
 * Validate if seats are available
 * @param seatNumbers - Array of seat numbers to validate
 * @param seatLayout - Current seat layout
 * @returns Object with validation result
 */
export const validateSeats = (
  seatNumbers: string[],
  seatLayout: ISeat[]
): { isValid: boolean; message: string; unavailableSeats: string[] } => {
  const unavailableSeats: string[] = [];

  for (const seatNumber of seatNumbers) {
    const seat = seatLayout.find((s) => s.seatNumber === seatNumber);

    if (!seat) {
      return {
        isValid: false,
        message: `Seat ${seatNumber} does not exist`,
        unavailableSeats: [seatNumber],
      };
    }

    if (!seat.isAvailable) {
      unavailableSeats.push(seatNumber);
    }
  }

  if (unavailableSeats.length > 0) {
    return {
      isValid: false,
      message: `Seats ${unavailableSeats.join(', ')} are already booked`,
      unavailableSeats,
    };
  }

  return {
    isValid: true,
    message: 'All seats are available',
    unavailableSeats: [],
  };
};

/**
 * Calculate total price for selected seats
 * @param seatNumbers - Array of seat numbers
 * @param seatLayout - Current seat layout
 * @returns Total price
 */
export const calculateTotalPrice = (
  seatNumbers: string[],
  seatLayout: ISeat[]
): number => {
  return seatNumbers.reduce((total, seatNumber) => {
    const seat = seatLayout.find((s) => s.seatNumber === seatNumber);
    return total + (seat?.price || 0);
  }, 0);
};
