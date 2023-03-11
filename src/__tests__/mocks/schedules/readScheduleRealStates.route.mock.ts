import { Repository } from 'typeorm';
import { AppDataSource } from '../../../database/dataSource';
import { Address } from '../../../entities/Address.entity';
import { Category } from '../../../entities/Category.entity';
import { RealEstate } from '../../../entities/RealEstate.entity';
import { Schedule } from '../../../entities/Schedule.entity';
import { User } from '../../../entities/User.entity';


type iRealEstateRepo = Repository<RealEstate>;
type iAddressRepo = Repository<Address>;
type iUserRepo = Repository<User>;
type iCategoryRepo = Repository<Category>;
type iScheduleRepo = Repository<Schedule>;

const manySchedules = async () => {
  const realEstateRepo: iRealEstateRepo =
    AppDataSource.getRepository(RealEstate);
  const addressRepo: iAddressRepo = AppDataSource.getRepository(Address);
  const userRepo: iUserRepo = AppDataSource.getRepository(User);
  const categoryRepo: iCategoryRepo = AppDataSource.getRepository(Category);
  const scheduleRepo: iScheduleRepo = AppDataSource.getRepository(Schedule);

  const userAdmin = userRepo.create({
    name: 'admin',
    email: 'admin@mail.com',
    password: '1234',
    admin: true,
  });

  const userNotAdmin = userRepo.create({
    name: 'user',
    email: 'user@mail.com',
    password: '1234',
  });

  await userRepo.save([userAdmin, userNotAdmin]);

  const category = await categoryRepo.save({ name: 'Apartamento' });
  const address = await addressRepo.save({
    city: 'São Paulo',
    street: 'Rua das Rosas',
    state: 'SP',
    zipCode: '000000011',
  });

  const realEstate = await realEstateRepo.save({
    value: 1000000.0,
    size: 440,
    address,
    category,
  });

  const schedule1 = await scheduleRepo.save({
    realEstate,
    user: userAdmin,
    date: '2022-03-01',
    hour: '12:30:00',
  });
  const schedule2 = await scheduleRepo.save({
    realEstate,
    user: userNotAdmin,
    date: '2022-03-01',
    hour: '13:30:00',
  });

  return {
    ...realEstate,
    schedules: [
      {
        ...{ id: schedule1.id, date: schedule1.date, hour: schedule1.hour },
        user: { ...userAdmin },
      },
      {
        ...{ id: schedule2.id, date: schedule2.date, hour: schedule2.hour },
        user: { ...userNotAdmin },
      },
    ],
    address,
    category,
  };
};

export default { manySchedules };
