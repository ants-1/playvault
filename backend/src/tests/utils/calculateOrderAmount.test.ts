import { calculateOrderAmount } from "../../utils/calculateOrderAmount";

describe("calculateOrderAmount", () => {
  it("should return 0 for an empty list", () => {
    const amount = calculateOrderAmount([]);
    expect(amount).toBe(0);
  });

  it("should correctly calculate the total amount for multiple items", () => {
    const amount = calculateOrderAmount([
      { price: 10, quantity: 2 },   
      { price: 5, quantity: 3 },    
      { price: 8, quantity: 1 },   
    ]);
    expect(amount).toBe(43);
  });

  it("should handle decimal prices", () => {
    const amount = calculateOrderAmount([
      { price: 9.99, quantity: 3 },  
    ]);
    expect(amount).toBeCloseTo(29.97);
  });

  it("should handle large quantities", () => {
    const amount = calculateOrderAmount([
      { price: 2, quantity: 1000 },
    ]);
    expect(amount).toBe(2000);
  });

  it("should throw if price is missing", () => {
    const badData = [{ quantity: 2 }] as any;
    expect(() => calculateOrderAmount(badData)).toThrow();
  });

  it("should throw if quantity is missing", () => {
    const badData = [{ price: 20 }] as any;
    expect(() => calculateOrderAmount(badData)).toThrow();
  });

  it("should return NaN if price or quantity is not numeric", () => {
    const data = [{ price: "10" as any, quantity: 2 }];
    const result = calculateOrderAmount(data);
    expect(result).toBeNaN();
  });
});
