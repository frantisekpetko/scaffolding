
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
import {Index, OneToMany} from 'typeorm'
import {Customer} from './customer.entity';
import {Order} from './order.entity';


@Entity({ name: 'address' })
export class Address extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  name: string;
  
  @Column({
   type: "varchar",   
  })
  street: string;
  
  @Column({
   type: "varchar",   
  })
  city: string;
  
  @Column({
   type: "varchar",   
  })
  postalCode: string;
  
  @Column({
   type: "varchar",   
  })
  state: string;
  
  @Column({
   type: "varchar",   
  })
  region: string;
  
  @Column({
   type: "varchar",   
  })
  telephone: string;
  
  
  @OneToMany(() => Customer, (customer) => customer.address)
  customers: Customer[];

  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
