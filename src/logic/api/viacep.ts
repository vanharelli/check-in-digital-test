export interface AddressData {
    logradouro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

export const fetchAddress = async (cep: string): Promise<AddressData | null> => {
    try {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return null;

        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (data.erro) return null;

        return {
            logradouro: data.logradouro,
            localidade: data.localidade,
            uf: data.uf
        };
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
};
