export const generateWhatsAppPayload = (formData: any) => {
    const lines = [
        `🏛 *CHECK-IN DIGITAL | AGÊNCIA MARKETELLI*`,
        `🟢 *STATUS:* AGUARDANDO LIBERAÇÃO`,
        `\n*IDENTIFICAÇÃO DO HÓSPEDE*`,
        `👤 *TITULAR:* ${formData.fullName.toUpperCase()}`,
    ];

    if (formData.isForeigner) {
        lines.push(`🌍 *ESTRANGEIRO:* SIM`);
        lines.push(`🏳 *PAÍS:* ${formData.passportCountry.toUpperCase()}`);
        lines.push(`🆔 *PASSAPORTE:* ${formData.passportId}`);
    } else {
        lines.push(`📑 *CPF:* ${formData.cpf}`);
        lines.push(`🎂 *NASCIMENTO:* ${formData.birthDate}`);
    }

    lines.push(`\n*LOCALIZAÇÃO E CONTATO*`);
    lines.push(`📍 *ENDEREÇO:* ${formData.address.toUpperCase()}, ${formData.number}`);
    lines.push(`🗺 *CIDADE:* ${formData.zipCode} - ${formData.city}/${formData.state}`);
    lines.push(`📱 *CONTATO:* ${formData.phone}`);
    lines.push(`📧 *E-MAIL:* ${formData.email.toLowerCase()}`);
    
    if (formData.roomNumber) {
        lines.push(`🔑 *QUARTO:* ${formData.roomNumber}`);
    }

    lines.push(`\n*LOGÍSTICA DE VEÍCULO*`);
    if (formData.hasVehicle) {
        lines.push(`🚗 *MODELO:* ${formData.vehicleModel.toUpperCase()} (${formData.vehicleColor.toUpperCase()})`);
        lines.push(`🆔 *PLACA:* ${formData.vehiclePlate.toUpperCase()}`);
        if (formData.vehicleExitTime) {
            lines.push(`⏱ *SAÍDA:* ${formData.vehicleExitTime}`);
        }
    } else {
        lines.push(`🚫 *VEÍCULO:* NÃO POSSUI`);
    }

    lines.push(`\n---`);
    lines.push(`⚡ *SISTEMA OPERACIONAL MARKETELLI*`);
    lines.push(`🛡 *PROTOCOLO STATELESS | 14 ANOS DE EXPERIÊNCIA*`);

    return lines.join('\n');
};