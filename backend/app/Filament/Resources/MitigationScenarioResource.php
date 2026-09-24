<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MitigationScenarioResource\Pages;
use App\Filament\Resources\MitigationScenarioResource\RelationManagers;
use App\Models\MitigationScenario;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class MitigationScenarioResource extends Resource
{
    protected static ?string $model = MitigationScenario::class;
    protected static bool $shouldRegisterNavigation = false;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
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

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->searchable(),
                Tables\Columns\TextColumn::make('level')->numeric()->sortable(),
                Tables\Columns\TextColumn::make('disaster_type')->searchable(),
                Tables\Columns\TextColumn::make('title')->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMitigationScenarios::route('/'),
            'create' => Pages\CreateMitigationScenario::route('/create'),
            'edit' => Pages\EditMitigationScenario::route('/{record}/edit'),
        ];
    }
}
