
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
import {Customer} from './customer.entity';
import {OrderToProduct} from './order_to_product.entity';


@Entity({ name: 'order' })
export class Order extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  mailTypeOrder: string;
  
  @Column({
   type: "varchar",   
  })
  transportType: string;
  
  @Column({
   type: "varchar",   
  })
  paymentType: string;
  
  @Column({
   type: "varchar",   
  })
  note: string;
  
  @Column({
   type: "int",   
  })
  customerId: number;
  
  @Column({
   type: "int",   
  })
  addressId: number;
  
  
  @ManyToOne(() => Address, (address) => address.orders)
  address: Address;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToMany(() => OrderToProduct, (order_to_product) => order_to_product.order)
  order_to_products: OrderToProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
