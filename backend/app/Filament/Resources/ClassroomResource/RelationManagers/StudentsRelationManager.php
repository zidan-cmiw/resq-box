<?php

namespace App\Filament\Resources\ClassroomResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class StudentsRelationManager extends RelationManager
{
    protected static string $relationship = 'students';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('mission_score')
                    ->label('Nilai LKPD (Misi)')
                    ->state(function ($record): string {
                        // total missions = 23 (approx)
                        $completed = count($record->mission_completed_ids ?? []);
                        return round(($completed / 23) * 100) . ' (' . $completed . ' selesai)';
                    }),
                Tables\Columns\TextColumn::make('mitigation_score')
                    ->label('Nilai Mitigasi')
                    ->state(function ($record): string {
                        $scores = array_values($record->mitigation_scores ?? []);
                        if (count($scores) === 0) return '0';
                        return round(array_sum($scores) / count($scores));
                    }),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
