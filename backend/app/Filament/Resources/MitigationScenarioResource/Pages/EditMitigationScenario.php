<?php

namespace App\Filament\Resources\MitigationScenarioResource\Pages;

use App\Filament\Resources\MitigationScenarioResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMitigationScenario extends EditRecord
{
    protected static string $resource = MitigationScenarioResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
