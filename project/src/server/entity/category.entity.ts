
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
import {Index, ManyToOne, OneToMany} from 'typeorm'
import {Admin} from './admin.entity';
import {Product} from './product.entity';


@Entity({ name: 'category' })
export class Category extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  title: string;
  
  @Column({
   type: "int",   
  })
  productCount: number;
  
  @Column({
   type: "int",   
  })
  parentId: number;
  
  @Column({
   type: "int",   
  })
  adminId: number;
  
  
  @ManyToOne(() => Admin, (admin) => admin.categorys)
  admin: Admin;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
