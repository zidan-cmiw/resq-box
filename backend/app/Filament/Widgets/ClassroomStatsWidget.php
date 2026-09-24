<?php

namespace App\Filament\Widgets;

use App\Models\Classroom;
use App\Models\Student;
use App\Models\MitigationScenario;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ClassroomStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Kelas Aktif', Classroom::count())
                ->description('Kelas yang sedang berjalan')
                ->descriptionIcon('heroicon-m-academic-cap')
                ->color('primary'),
            Stat::make('Total Siswa', Student::count())
                ->description('Siswa terdaftar')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('success'),
            Stat::make('Skenario Mitigasi', MitigationScenario::count())
                ->description('Total soal mitigasi aktif')
                ->descriptionIcon('heroicon-m-puzzle-piece')
                ->color('warning'),
        ];
    }
}
