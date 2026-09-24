<?php

namespace App\Filament\Resources\ClassroomResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class MitigationScenariosRelationManager extends RelationManager
{
    protected static string $relationship = 'mitigationScenarios';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('id')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                Forms\Components\Select::make('disaster_type')
                    ->options([
                        'gempa' => 'Gempa Bumi',
                        'banjir' => 'Banjir',
                        'kebakaran' => 'Gunung Meletus',
                        'tsunami' => 'Tsunami',
                        'evakuasi' => 'Evakuasi Umum',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('level')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Repeater::make('actions')
                    ->schema([
                        Forms\Components\TextInput::make('id')->required(),
                        Forms\Components\TextInput::make('label')->required(),
                        Forms\Components\TextInput::make('icon')->default('warning'),
                        Forms\Components\Toggle::make('isCorrect')->default(true),
                        Forms\Components\TextInput::make('feedback')->nullable(),
                    ])
                    ->columnSpanFull(),
                Forms\Components\TagsInput::make('correct_order')
                    ->label('ID Tindakan yang Benar (Berurutan)')
                    ->helperText('Masukkan ID tindakan yang benar sesuai urutannya')
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                Tables\Columns\TextColumn::make('id')->searchable(),
                Tables\Columns\TextColumn::make('level')->numeric()->sortable(),
                Tables\Columns\TextColumn::make('disaster_type')->searchable(),
                Tables\Columns\TextColumn::make('title')->searchable(),
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
