-- CreateTable
CREATE TABLE "patients" (
    "id" BIGSERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "record_number" VARCHAR(50) NOT NULL,
    "sex" CHAR(1) NOT NULL,
    "birth_date" DATE NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_staff" (
    "id" BIGSERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "national_id" VARCHAR(20) NOT NULL,
    "specialty" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(150),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surgical_notes" (
    "id" BIGSERIAL NOT NULL,
    "patient_id" BIGINT NOT NULL,
    "start_datetime" TIMESTAMP(3) NOT NULL,
    "end_datetime" TIMESTAMP(3) NOT NULL,
    "surgical_procedures" TEXT NOT NULL,
    "pathological_findings" TEXT NOT NULL,
    "techniques_used" TEXT NOT NULL,
    "preoperative_diagnosis" TEXT NOT NULL,
    "postoperative_diagnosis" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surgical_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surgical_team_members" (
    "surgical_note_id" BIGINT NOT NULL,
    "medical_staff_id" BIGINT NOT NULL,
    "role" VARCHAR(100) NOT NULL,

    CONSTRAINT "surgical_team_members_pkey" PRIMARY KEY ("surgical_note_id","medical_staff_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_record_number_key" ON "patients"("record_number");

-- CreateIndex
CREATE UNIQUE INDEX "medical_staff_national_id_key" ON "medical_staff"("national_id");

-- AddForeignKey
ALTER TABLE "surgical_notes" ADD CONSTRAINT "surgical_notes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surgical_team_members" ADD CONSTRAINT "surgical_team_members_surgical_note_id_fkey" FOREIGN KEY ("surgical_note_id") REFERENCES "surgical_notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surgical_team_members" ADD CONSTRAINT "surgical_team_members_medical_staff_id_fkey" FOREIGN KEY ("medical_staff_id") REFERENCES "medical_staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
