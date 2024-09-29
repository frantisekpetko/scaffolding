
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
import {Index, ManyToOne} from 'typeorm'
import {Order} from './order.entity';
import {Product} from './product.entity';


@Entity({ name: 'order_to_product' })
export class OrderToProduct extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "int",   
  })
  quantity: number;
  
  @Column({
   type: "int",   
  })
  orderId: number;
  
  @Column({
   type: "int",   
  })
  productId: number;
  
  
  @ManyToOne(() => Order, (order) => order.order_to_products)
  order: Order;

  @ManyToOne(() => Product, (product) => product.order_to_products)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
