import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory

describe("List Cars", () => {

  beforeEach(() => {

    carsRepositoryInMemory = new CarsRepositoryInMemory()
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  })

  it("should be able to list all available cars by brand", async () => {

    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Carro description",
      daily_rate: 110.00,
      license_plate: "DEF-1234",
      fine_amount: 40,
      brand: "Car_brand",
      category_id: "category_id"
    })

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car])
  })

  it("should be able to list all available cars by name", async () => {

    const car = await carsRepositoryInMemory.create({
      name: "Car2",
      description: "Carro description",
      daily_rate: 110.00,
      license_plate: "DEF-1235",
      fine_amount: 40,
      brand: "Car_brand_test",
      category_id: "category_id"
    })

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car2",
    });

    expect(cars).toEqual([car])
  })

  it("should be able to list all available cars by brand", async () => {

    const car = await carsRepositoryInMemory.create({
      name: "Car3",
      description: "Carro description",
      daily_rate: 110.00,
      license_plate: "DEF-1236",
      fine_amount: 40,
      brand: "Car_brand_test",
      category_id: "category_id"
    })

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Car_brand_test",
    });

    expect(cars).toEqual([car])
  })

  it("should be able to list all available cars by category", async () => {

    const car = await carsRepositoryInMemory.create({
      name: "Car4",
      description: "Carro description",
      daily_rate: 110.00,
      license_plate: "DEF-1237",
      fine_amount: 40,
      brand: "Car_brand_test",
      category_id: "category_id"
    })

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "category_id",
    });

    expect(cars).toEqual([car])
  })
})