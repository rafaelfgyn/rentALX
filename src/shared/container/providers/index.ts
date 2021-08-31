import { container } from "tsyringe";
import { IDateProvider } from "./DateProvider/IDateProvider";
import { DayjsDateProvider } from "./DateProvider/Implementations/DayjsDataProvider";

container.registerSingleton<IDateProvider>('DayjsDateProvider', DayjsDateProvider)