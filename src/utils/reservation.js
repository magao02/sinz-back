const { DateTime } = require("luxon");

/**
* @param {DateTime | Date} date 
* @param {string} horario 
* @returns DateTime
*/
function createDateTime(date, horario) {
  const [hours, minutes] = horario.split(':').map(x => parseInt(x));
  if (date instanceof Date) {
    // a data que vem do BD é em utc.. por algum motivo
    date = DateTime.fromJSDate(date).toUTC().plus({hours:3}).setZone("America/Fortaleza");
  }
  return date.set({ hours, minutes });
}

module.exports = {
  createDateTime,
  isReservationValid(reserva, reservas) {
    try {
      const chegada = reserva.chegada ?? createDateTime(reserva.dataChegada, reserva.horarioChegada);
      const saida = reserva.saida ?? createDateTime(reserva.dataSaida, reserva.horarioSaida);
  
      for (let otherReserva of reservas) {
        const otherChegada = createDateTime(otherReserva.dataChegada, otherReserva.horarioChegada);
        const otherSaida = createDateTime(otherReserva.dataSaida, otherReserva.horarioSaida);
        if (chegada > otherChegada) {
          // essa reserva inicia apos a outra,
          // então é invalida se essa inicia antes da outra acabar
          if (chegada < otherSaida) {
            return false;
          }
        } else {
          // essa reserva inicia antes da outra,
          // então é invalida se acaba depois da outra iniciar
          if (saida > otherChegada) {
            return false;
          }
        }
      }
    } catch (err) {
      // se houve algum erro como data invalida no apartamento,
      // considere qualquer reserva como invalida. a algum ponto algum admin tera que resolver esse problema.. talvez
      return false;
    }
    return true;
  },
  validaData(data) {
    data = data.split("-");
    return new Date(
      `${data[0]}-${data[1].padStart(2, '0')}-${data[2].padStart(2, '0')}T01:00:00+01:00`
    );
  },
  validaHorario(horario) {
    function assert(cond) {
      if (!cond) {
        throw new Error("Assertion failed");
      }
    }
    assert(horario.split(':').length === 2);
    const [hour, minute] = horario.split(':').map(x => parseInt(x));
    assert(hour >= 0 && hour < 24);
    assert(minute >= 0 && minute < 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  },
  calculaProximaReserva(reserva, reservas) {
    function findMinIndex(arr, pred) {
      let min = null;
      let ind = -1;
      for (let i = 0; i < arr.length; ++i) {
        let value = pred(arr[i]);
        if (value === undefined) continue;
        if (ind === -1 || value < min) {
          min = value;
          ind = i;
        }
      }
      return ind;
    }

    // calculando qual a reserva mais proxima
    let closestReserva = findMinIndex(reservas, otherReserva => {
      const otherChegada = createDateTime(otherReserva.dataChegada, otherReserva.horarioChegada);
      const otherSaida = createDateTime(otherReserva.dataSaida, otherReserva.horarioSaida);
      let diff = Math.min(Math.abs(otherChegada - reserva.saida), Math.abs(reserva.chegada - otherSaida));
      return diff;
    });
    
    closestReserva = reservas[closestReserva];
    let nextClosestReserva;
    if (closestReserva) {
      const chegada = createDateTime(closestReserva.dataChegada, closestReserva.horarioChegada);
  
      // encontra o menor maior que closestReserva
      nextClosestReserva = closestReserva ? findMinIndex(reservas, otherReserva => {
        if (otherReserva == closestReserva) return;
        const otherChegada = createDateTime(otherReserva.dataChegada, otherReserva.horarioChegada);
        if (otherChegada < chegada) return;
        return otherChegada - chegada;
      }) : -1;
      nextClosestReserva = reservas[nextClosestReserva];
    }

    return [closestReserva, nextClosestReserva];
  },
  formatReserva(reserva) {
    function formatDate(date) {
      return date.getUTCDate().toString().padStart(2, '0') + "/" + (date.getUTCMonth() + 1).toString().padStart(2, '0') + "/" + date.getUTCFullYear();
    };
    return {
      chegada: formatDate(reserva.dataChegada),
      saida: formatDate(reserva.dataSaida),
    };
  },
  dayDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date2 - date1) / oneDay));
  },
};