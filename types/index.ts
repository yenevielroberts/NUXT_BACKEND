export interface Planeta{

    id: number
    nombre: string | null
    anillos: number | null
    satelites: number | null
    habitabilidad: string | null
    orbita_dias: number | null
    galaxia_id:number | null
    nombre_galaxia: string | null
}

// Modelo base que definir el tipo de dato en el fetch.

export interface Galaxia{
    id: number
    nombre: string | null
    num_planetas_count: number | null
    curiosidades: string | null
    tipo: string | null
}