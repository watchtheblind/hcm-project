// Datos de demostración mientras el backend expone GET /patients.
// Espeja el modelo Patient de Prisma: recordNumber, sex ('M'|'F'),
// birthDate, status ('active'|'inactive').

export type PacienteSex = "M" | "F"
export type PacienteStatus = "active" | "inactive"

export type Paciente = {
  id: number
  firstName: string
  lastName: string
  recordNumber: string
  sex: PacienteSex
  birthDate: string // ISO date
  status: PacienteStatus
}

export const SEX_LABELS: Record<PacienteSex, string> = {
  M: "Masculino",
  F: "Femenino",
}

export const STATUS_LABELS: Record<PacienteStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
}

export const pacientesMock: Paciente[] = [
  { id: 1, firstName: "María", lastName: "González", recordNumber: "HC-2024-0001", sex: "F", birthDate: "1985-03-12", status: "active" },
  { id: 2, firstName: "José", lastName: "Rodríguez", recordNumber: "HC-2024-0002", sex: "M", birthDate: "1978-11-02", status: "active" },
  { id: 3, firstName: "Ana", lastName: "Pérez", recordNumber: "HC-2024-0003", sex: "F", birthDate: "1992-07-25", status: "inactive" },
  { id: 4, firstName: "Carlos", lastName: "Martínez", recordNumber: "HC-2024-0004", sex: "M", birthDate: "1969-01-30", status: "active" },
  { id: 5, firstName: "Luisa", lastName: "Hernández", recordNumber: "HC-2024-0005", sex: "F", birthDate: "2001-09-14", status: "active" },
  { id: 6, firstName: "Pedro", lastName: "Silva", recordNumber: "HC-2024-0006", sex: "M", birthDate: "1958-05-08", status: "inactive" },
  { id: 7, firstName: "Carmen", lastName: "Torres", recordNumber: "HC-2024-0007", sex: "F", birthDate: "1988-12-19", status: "active" },
  { id: 8, firstName: "Miguel", lastName: "Rojas", recordNumber: "HC-2024-0008", sex: "M", birthDate: "1995-04-03", status: "active" },
  { id: 9, firstName: "Valentina", lastName: "Morales", recordNumber: "HC-2024-0009", sex: "F", birthDate: "2010-02-27", status: "active" },
  { id: 10, firstName: "Andrés", lastName: "Figueroa", recordNumber: "HC-2024-0010", sex: "M", birthDate: "1974-08-21", status: "inactive" },
  { id: 11, firstName: "Gabriela", lastName: "Castillo", recordNumber: "HC-2024-0011", sex: "F", birthDate: "1999-06-11", status: "active" },
  { id: 12, firstName: "Rafael", lastName: "Ochoa", recordNumber: "HC-2024-0012", sex: "M", birthDate: "1962-10-05", status: "active" },
  { id: 13, firstName: "Daniela", lastName: "Rivas", recordNumber: "HC-2024-0013", sex: "F", birthDate: "1997-03-17", status: "inactive" },
  { id: 14, firstName: "Víctor", lastName: "Palacios", recordNumber: "HC-2024-0014", sex: "M", birthDate: "1981-12-29", status: "active" },
]

// Usuarios sembrados por prisma/seed.ts — solo demo hasta tener GET /users.
export type UsuarioDemo = {
  email: string
  role: string
}

export const usuariosMock: UsuarioDemo[] = [
  { email: "admin@hcm.local", role: "admin" },
  { email: "cirujano@hcm.local", role: "cirujano" },
  { email: "residente@hcm.local", role: "residente" },
  { email: "enfermeria@hcm.local", role: "enfermeria" },
]
