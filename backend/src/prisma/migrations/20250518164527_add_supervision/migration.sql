BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Supervision] (
    [id] NVARCHAR(1000) NOT NULL,
    [studentId] NVARCHAR(1000) NOT NULL,
    [professorId] NVARCHAR(1000) NOT NULL,
    [dateTime] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [notes] NVARCHAR(1000),
    CONSTRAINT [Supervision_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Supervision] ADD CONSTRAINT [Supervision_studentId_fkey] FOREIGN KEY ([studentId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Supervision] ADD CONSTRAINT [Supervision_professorId_fkey] FOREIGN KEY ([professorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
