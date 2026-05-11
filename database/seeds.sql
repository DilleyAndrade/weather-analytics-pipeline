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
