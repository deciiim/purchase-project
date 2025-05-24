
import { EntityRepository, Repository } from 'typeorm';
import { DemandeProjet } from './demande-projet.entity';  

@EntityRepository(DemandeProjet)
export class DemandeProjetRepository extends Repository<DemandeProjet> {}
