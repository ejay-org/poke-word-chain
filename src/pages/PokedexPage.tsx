import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PokedexPage() {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-background p-6">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">포켓몬 도감</h1>
                    <p className="text-muted-foreground">
                        이 기능은 아직 개발 중입니다.<br />
                        조금만 기다려주세요!
                    </p>
                </div>

                <Button variant="outline" onClick={() => navigate('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    메인으로 돌아가기
                </Button>
            </div>
        </div>
    );
}
