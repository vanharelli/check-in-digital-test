export const generateWhatsAppPayload = (formData: any) => {
    const lines = [
        `*FICHA DE CHECK-IN DIGITAL - ALPHA PLAZA*`,
        ``,
        `*TITULAR:* ${formData.fullName.toUpperCase()}`,
    ];

    if (formData.isForeigner) {
        lines.push(`*ESTRANGEIRO:* SIM`);
        lines.push(`*PAÍS:* ${formData.passportCountry.toUpperCase()}`);
        lines.push(`*PASSAPORTE:* ${formData.passportId}`);
    } else {
        lines.push(`*CPF:* ${formData.cpf}`);
        lines.push(`*NASCIMENTO:* ${formData.birthDate}`);
    }

    lines.push(``);
    lines.push(`*ENDEREÇO:* ${formData.address.toUpperCase()}, ${formData.number}`);
    lines.push(`*LOCALIZAÇÃO:* ${formData.zipCode} - ${formData.city}/${formData.state}`);
    lines.push(`*CONTATO:* ${formData.phone} | ${formData.email}`);
    
    if (formData.roomNumber) {
        lines.push(`*QUARTO:* ${formData.roomNumber}`);
    }

    if (formData.hasVehicle) {
        lines.push(``);
        lines.push(`*VEÍCULO:* ${formData.vehicleModel.toUpperCase()} - ${formData.vehicleColor.toUpperCase()}`);
        lines.push(`*PLACA:* ${formData.vehiclePlate.toUpperCase()}`);
        if (formData.vehicleExitTime) {
            lines.push(`*SAÍDA:* ${formData.vehicleExitTime}`);
        }
    } else {
        lines.push(``);
        lines.push(`*VEÍCULO:* NÃO POSSUI`);
    }

    return lines.join('\n');
};
