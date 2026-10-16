-- ============================================================================
--  BKSOFT — Esquema de base de datos del CU-01 "Registrarse"
--  Motor: PostgreSQL
--
--  Incluye lo ya implementado (usuarios, clientes, tokens_verificacion,
--  log_auditoria) y lo que faltaba para cumplir el CU-01:
--    + tabla aceptaciones_terminos  (RN9: constancia de fecha, hora y versión)
--    + estado 'inactivo' en usuarios (enum Estado del modelo de dominio)
--    + celular y fecha_nacimiento obligatorios (RN7, RN8)
--    + formato internacional del celular (RN7)
--    + límite de 5 intentos fallidos del código (RN10)
--    + índices sobre las claves foráneas
--
--  Ejecutar sobre una base vacía, de arriba hacia abajo.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1) USUARIOS
--    Datos de acceso a la cuenta. Base de todos los roles.
-- ----------------------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password_hash   VARCHAR(255),                         -- NULL en cuentas creadas con Google (RN6)
    fecha_registro  TIMESTAMP    NOT NULL DEFAULT NOW(),
    estado_cuenta   VARCHAR(20)  NOT NULL DEFAULT 'pendiente',

    CONSTRAINT ck_usuarios_estado
        CHECK (estado_cuenta IN ('pendiente', 'activo', 'inactivo', 'bloqueado'))
);

-- ----------------------------------------------------------------------------
-- 2) CLIENTES
--    Especialización de usuarios (1 a 1): id_cliente ES el id_usuario.
-- ----------------------------------------------------------------------------
CREATE TABLE clientes (
    id_cliente        INT          PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    fecha_nacimiento  DATE         NOT NULL,              -- RN8 (edad mínima 18: se valida en el backend)
    celular           VARCHAR(20)  NOT NULL,              -- RN7
    id_google_sso     VARCHAR(100) UNIQUE,                -- solo en registro con Google

    CONSTRAINT fk_clientes_usuario
        FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT ck_clientes_celular
        CHECK (celular ~ '^\+[0-9]{8,19}$'),              -- "+" + código de país + número, mín. 8 dígitos
    CONSTRAINT ck_clientes_fecha_nacimiento
        CHECK (fecha_nacimiento > DATE '1900-01-01')
);

-- ----------------------------------------------------------------------------
-- 3) TOKENS_VERIFICACION
--    Código de 6 dígitos para activar la cuenta (registro por email).
-- ----------------------------------------------------------------------------
CREATE TABLE tokens_verificacion (
    id_token           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id         INT         NOT NULL,
    token_validacion   VARCHAR(64) NOT NULL,              -- código de 6 dígitos
    token_expira       TIMESTAMP   NOT NULL,              -- vigencia de 24 h (RN10)
    estado_token       VARCHAR(20) NOT NULL DEFAULT 'activo',
    intentos_fallidos  INT         NOT NULL DEFAULT 0,
    creado_en          TIMESTAMP   NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_tokens_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT ck_tokens_estado
        CHECK (estado_token IN ('activo', 'expirado', 'utilizado')),
    CONSTRAINT ck_tokens_intentos
        CHECK (intentos_fallidos BETWEEN 0 AND 5),        -- RN10
    CONSTRAINT ck_tokens_vencimiento
        CHECK (token_expira > creado_en)
);

CREATE INDEX ix_tokens_usuario ON tokens_verificacion (usuario_id);

-- ----------------------------------------------------------------------------
-- 4) LOG_AUDITORIA
--    Un evento por cada acción relevante del registro (postcondición 4).
-- ----------------------------------------------------------------------------
CREATE TABLE log_auditoria (
    id_log        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id    INT          NOT NULL,
    evento        VARCHAR(100) NOT NULL,
    fecha_evento  TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_log_cliente
        FOREIGN KEY (cliente_id) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

CREATE INDEX ix_log_cliente ON log_auditoria (cliente_id);

-- ----------------------------------------------------------------------------
-- 5) ACEPTACIONES_TERMINOS   (NUEVA)
--    Constancia de la aceptación de Términos y Política de Privacidad (RN9).
--    Un usuario puede tener varias si los documentos cambian de versión.
-- ----------------------------------------------------------------------------
CREATE TABLE aceptaciones_terminos (
    id_aceptacion     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id        INT         NOT NULL,
    fecha_hora        TIMESTAMP   NOT NULL DEFAULT NOW(),
    version_terminos  VARCHAR(20) NOT NULL,
    version_politica  VARCHAR(20) NOT NULL,

    CONSTRAINT fk_aceptaciones_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT uq_aceptaciones_version
        UNIQUE (usuario_id, version_terminos, version_politica)
);

CREATE INDEX ix_aceptaciones_usuario ON aceptaciones_terminos (usuario_id);

COMMIT;


-- ============================================================================
--  SI LA BASE YA EXISTE (bksoft con las 4 tablas creadas):
--  no corras lo de arriba; corré solo este bloque para agregar lo que falta.
-- ============================================================================
/*
BEGIN;

-- Estado 'inactivo'
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_estado_cuenta_check;
ALTER TABLE usuarios ADD CONSTRAINT ck_usuarios_estado
    CHECK (estado_cuenta IN ('pendiente', 'activo', 'inactivo', 'bloqueado'));

-- Celular y fecha de nacimiento obligatorios (si ya lo corriste antes, no pasa nada)
ALTER TABLE clientes ALTER COLUMN celular SET NOT NULL;
ALTER TABLE clientes ALTER COLUMN fecha_nacimiento SET NOT NULL;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS id_google_sso VARCHAR(100) UNIQUE;
ALTER TABLE clientes ADD CONSTRAINT ck_clientes_celular CHECK (celular ~ '^\+[0-9]{8,19}$');

-- Código de 6 dígitos: no puede ser único en toda la tabla (se repetiría entre usuarios)
ALTER TABLE tokens_verificacion DROP CONSTRAINT IF EXISTS tokens_verificacion_token_validacion_key;
ALTER TABLE tokens_verificacion ADD COLUMN IF NOT EXISTS intentos_fallidos INT NOT NULL DEFAULT 0;
ALTER TABLE tokens_verificacion ADD COLUMN IF NOT EXISTS creado_en TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE tokens_verificacion ADD CONSTRAINT ck_tokens_intentos CHECK (intentos_fallidos BETWEEN 0 AND 5);

-- Índices de claves foráneas
CREATE INDEX IF NOT EXISTS ix_tokens_usuario ON tokens_verificacion (usuario_id);
CREATE INDEX IF NOT EXISTS ix_log_cliente    ON log_auditoria (cliente_id);

-- Tabla nueva
CREATE TABLE IF NOT EXISTS aceptaciones_terminos (
    id_aceptacion     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id        INT         NOT NULL,
    fecha_hora        TIMESTAMP   NOT NULL DEFAULT NOW(),
    version_terminos  VARCHAR(20) NOT NULL,
    version_politica  VARCHAR(20) NOT NULL,
    CONSTRAINT fk_aceptaciones_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT uq_aceptaciones_version
        UNIQUE (usuario_id, version_terminos, version_politica)
);
CREATE INDEX IF NOT EXISTS ix_aceptaciones_usuario ON aceptaciones_terminos (usuario_id);

COMMIT;
*/