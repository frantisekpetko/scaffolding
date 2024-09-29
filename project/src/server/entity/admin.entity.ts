
import { 
 BaseEntity,
 Column, 
 Entity,
 PrimaryGeneratedColumn,
 CreateDateColumn, 
 UpdateDateColumn 
} from 'typeorm';
import {Index, OneToMany} from 'typeorm'
import {Category} from './category.entity';


@Entity({ name: 'admin' })
export class Admin extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
   type: "varchar",   
  })
  name: string;
  
  @Column({
   type: "text",   
  })
  password: string;
  
  @Column({
   type: "boolean",   
  })
  superadmin: boolean;
  
  
  @OneToMany(() => Category, (category) => category.admin)
  categorys: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
