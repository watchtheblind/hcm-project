-- CreateIndex
CREATE INDEX "surgical_notes_patient_id_idx" ON "surgical_notes"("patient_id");

-- CreateIndex
CREATE INDEX "surgical_team_members_medical_staff_id_idx" ON "surgical_team_members"("medical_staff_id");
