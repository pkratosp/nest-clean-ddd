import { Studant } from "../../enterprise/entities/studants";

export abstract class StudantsRepository {
  abstract findByEmail(email: string): Promise<Studant | null>;
  abstract create(studant: Studant): Promise<void>;
}
