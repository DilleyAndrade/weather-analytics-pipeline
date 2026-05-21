INSERT INTO dim_location (
    city,
    state,
    country,
    latitude,
    longitude,
    timezone
)
VALUES
    ('Recife', 'Pernambuco', 'Brazil', -8.047600, -34.877000, 'America/Recife'),
    ('São Paulo', 'São Paulo', 'Brazil', -23.550520, -46.633308, 'America/Sao_Paulo'),
    ('Rio de Janeiro', 'Rio de Janeiro', 'Brazil', -22.906847, -43.172897, 'America/Sao_Paulo'),
    ('Brasília', 'Distrito Federal', 'Brazil', -15.793889, -47.882778, 'America/Sao_Paulo'),
    ('Manaus', 'Amazonas', 'Brazil', -3.119028, -60.021731, 'America/Manaus'),
    ('Porto Alegre', 'Rio Grande do Sul', 'Brazil', -30.034647, -51.217658, 'America/Sao_Paulo')
ON CONFLICT (city, state, country) DO NOTHING;

INSERT INTO dashboard_user (
    username,
    display_name,
    role,
    password_salt,
    password_hash
)
VALUES
    (
        'admin',
        'Administrador',
        'admin',
        'weather-admin-salt',
        'f7c537a56a4a2efb3b1d1c1c896079f16cfc361dc81f38449f18b0ed50ba4095'
    ),
    (
        'usuario',
        'Usuário Normal',
        'user',
        'weather-user-salt',
        '8300700c4b38f8ce6e267dbe7b57b46deb78034d7b82eee9f6248279b76fdcd8'
    )
ON CONFLICT (username) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    role = EXCLUDED.role,
    password_salt = EXCLUDED.password_salt,
    password_hash = EXCLUDED.password_hash,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;
