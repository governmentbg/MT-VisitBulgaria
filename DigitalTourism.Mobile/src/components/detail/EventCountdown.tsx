import React, {useState, useEffect, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';

interface EventCountdownProps {
  targetDate: string;
  status: 'upcoming' | 'active' | 'past';
}

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeCountdown(target: Date): CountdownValues {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function EventCountdown({targetDate, status}: EventCountdownProps) {
  const {t} = useTranslation('events');
  const {t: tCommon} = useTranslation('common');
  const targetDateObj = useMemo(() => new Date(targetDate), [targetDate]);
  const [countdown, setCountdown] = useState<CountdownValues>(() =>
    computeCountdown(targetDateObj),
  );

  // Use a ref so the interval callback never causes re-subscription
  const targetRef = useRef(targetDateObj);
  targetRef.current = targetDateObj;

  useEffect(() => {
    if (status !== 'upcoming') return;
    const interval = setInterval(() => {
      setCountdown(computeCountdown(targetRef.current));
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'active') {
    return (
      <Box flexDirection="row" alignItems="center" gap="xs" marginTop="m">
        <Box style={styles.pulseDot} />
        <Text fontFamily={fonts.bold} style={styles.activeText}>
          {t('status.happeningNow', {defaultValue: 'Happening now'})}
        </Text>
      </Box>
    );
  }

  if (status === 'past') {
    return (
      <Box marginTop="m">
        <Text style={styles.pastText}>
          {t('status.eventEnded', {defaultValue: 'Event ended'})}
        </Text>
      </Box>
    );
  }

  // UPCOMING — show countdown
  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      gap="s"
      marginTop="m"
      accessible={true}
      accessibilityLabel={tCommon('a11y.countdown', {days: countdown.days, hours: countdown.hours, minutes: countdown.minutes})}
      accessibilityRole="text">
      <CountdownUnit value={countdown.days} label={t('countdown.days', {defaultValue: 'Days'})} />
      <Text style={styles.separator}>:</Text>
      <CountdownUnit value={countdown.hours} label={t('countdown.hours', {defaultValue: 'Hours'})} />
      <Text style={styles.separator}>:</Text>
      <CountdownUnit value={countdown.minutes} label={t('countdown.min', {defaultValue: 'Min'})} />
      <Text style={styles.separator}>:</Text>
      <CountdownUnit value={countdown.seconds} label={t('countdown.sec', {defaultValue: 'Sec'})} />
    </Box>
  );
}

function CountdownUnit({value, label}: {value: number; label: string}) {
  return (
    <Box alignItems="center" style={styles.unit} importantForAccessibility="no">
      <Text fontFamily={fonts.bold} style={styles.unitValue}>
        {String(value).padStart(2, '0')}
      </Text>
      <Text style={styles.unitLabel}>{label}</Text>
    </Box>
  );
}

const styles = StyleSheet.create({
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.green500,
  },
  activeText: {
    fontSize: moderateScale(14),
    color: palette.green500,
  },
  pastText: {
    fontSize: moderateScale(14),
    color: palette.gray600,
  },
  unit: {
    backgroundColor: palette.green700,
    borderRadius: 8,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(8),
    minWidth: moderateScale(48),
  },
  unitValue: {
    fontSize: moderateScale(20),
    color: palette.white,
  },
  unitLabel: {
    fontSize: moderateScale(10),
    color: palette.green50,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  separator: {
    fontSize: moderateScale(20),
    color: palette.green700,
    alignSelf: 'center',
    fontWeight: '700',
  },
});
