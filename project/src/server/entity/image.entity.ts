
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
import {Index, ManyToOne} from 'typeorm'
import {Product} from './product.entity';


@Entity({ name: 'image' })
export class Image extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  name: string;
  
  @Column({
   type: "int",   
  })
  path: number;
  
  @Column({
   type: "int",   
  })
  productId: number;
  
  
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
