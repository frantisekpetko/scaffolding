
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
import {Index, ManyToOne, OneToMany} from 'typeorm'
import {Address} from './address.entity';
import {Order} from './order.entity';


@Entity({ name: 'customer' })
export class Customer extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  name: string;
  
  @Column({
   type: "varchar",   
  })
  email: string;
  
  @Column({
   type: "varchar",   
  })
  password: string;
  
  @Column({
   type: "varchar",   
  })
  authStatus: string;
  
  @Column({
   type: "datetime",   
  })
  bannedAt: string;
  
  @Column({
   type: "int",   
  })
  addressId: number;
  
  
  @ManyToOne(() => Address, (address) => address.customers)
  address: Address;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
