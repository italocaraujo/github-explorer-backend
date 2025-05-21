import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['githubUsername'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  githubUsername: string;

  @Column({ type: 'jsonb', nullable: true })
  profileData: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}